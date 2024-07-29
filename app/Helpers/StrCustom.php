<?php

namespace App\Helpers;

use App\Models\District;
use App\Models\SubDistrict;

class StrCustom
{
    public static function haveWhitespace(string $input)
    {
        $whiteSpace = strpos($input, " "); // tìm vị trí xuất hiện khoảng trắng trong chuỗi
        return $whiteSpace ? true : false;
    }

    public static function checkAddress($address)
    {
        try {
            // return (int)$address['cityId'];
            $check = District::where('city_id', (int)$address['cityId'])
                ->where('id', (int)$address['districtId'])
                ->first();
            if (!$check) return false;
            $check_subDistrict = SubDistrict::where('district_id', (int)$address['districtId'])
                ->where('id', (int)$address['subDistrictId'])->first();

            if (!$check_subDistrict) return false;

            return true;
        } catch (\Throwable $th) {
            return 12;
        }
    }
}
